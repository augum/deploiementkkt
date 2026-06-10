package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.CartographieStructureRequestDto;
import bdom.kikwit.Dto.CartographieStructureResponseDto;
import bdom.kikwit.Dto.CategorieRequestDto;
import bdom.kikwit.Entities.CartographieStructure;
import bdom.kikwit.Entities.Etablissement;
import bdom.kikwit.Entities.Role;
import bdom.kikwit.Entities.SourceEnergie;
import bdom.kikwit.Mappers.CartographieStructureMapper;
import bdom.kikwit.Repositories.CartographieStructureRepository;
import bdom.kikwit.Repositories.EtablissementRepository;
import bdom.kikwit.Repositories.SourceEnergieRepository;
import bdom.kikwit.Services.CartographieStructureService;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional
public class CartographieStructureServiceImpl implements CartographieStructureService {
    private CartographieStructureMapper mapper;
    private CartographieStructureRepository repository;
    private EtablissementRepository etablissementRepository;
    private SourceEnergieRepository sourceEnergieRepository;
// enregistrement d'une cartographie de structure
    @Override
    public CartographieStructureResponseDto save(CartographieStructureRequestDto requestDto) {
        CartographieStructure cartographieStructure = mapper.fromCartographieStructureRequestDto(requestDto);
        CartographieStructure save = repository.save(cartographieStructure);
        return mapper.ToCartographieStructureResponseDto(save);
    }
// mis à jour d'une cartographie
    @Override
    public CartographieStructureResponseDto update(Long id, CartographieStructureRequestDto requestDto) {

        CartographieStructure fromEntity= repository.findById(id).get();
        CartographieStructure structure= mapper.fromCartographieStructureRequestDto(requestDto);
        fromEntity.setForage(structure.getForage());
        fromEntity.setId_ess(structure.getId_ess());
        fromEntity.setIncinerateur(structure.getIncinerateur());
        fromEntity.setDistance_bdom(structure.getDistance_bdom());
        fromEntity.setElectricite(structure.getElectricite());
        fromEntity.setCapacite_transfusion(structure.isCapacite_transfusion());
        fromEntity.setIncinerateur(structure.getIncinerateur());
        fromEntity.setEquipement_biom(structure.getEquipement_biom());
        fromEntity.setPopulation_cible(structure.getPopulation_cible());
        fromEntity.setPresence_blocop(structure.isPresence_blocop());
        fromEntity.setReabilitation(structure.getReabilitation());
        fromEntity.setEau(structure.getEau());
        repository.save(fromEntity);
        return mapper.ToCartographieStructureResponseDto(fromEntity);
    }
// Affichage d'une cartographie
    @Override
    public CartographieStructureResponseDto getOne(Long id) {
        CartographieStructure getOne= repository.findById(id).get();
        return mapper.ToCartographieStructureResponseDto(getOne);
    }

    @Override
    public String delete(Long id) {
        Optional<CartographieStructure> cartographieStructure = repository.findById(id);
        if (cartographieStructure.isPresent()){
            repository.deleteById(id);
            return " Cartographie supprimée avec succes";
        }
        return "Aucune cartographie trouvée";
    }

    // Lister toutes les cartographie
    @Override
    public List<CartographieStructureResponseDto> liste() {
        List<CartographieStructure> structureList = repository.findAll();
        for(CartographieStructure cat: structureList){
            Etablissement et = etablissementRepository.findById(cat.getId_ess()).get();
            SourceEnergie se = sourceEnergieRepository.findById(cat.getId_se()).get();

            cat.setEtablissement(et);
            cat.setSourceEnergie(se);
        }
        return structureList
                .stream()
                .map(cartographieStructur->mapper.ToCartographieStructureResponseDto(cartographieStructur))
                .collect(Collectors.toList());
    }
}
