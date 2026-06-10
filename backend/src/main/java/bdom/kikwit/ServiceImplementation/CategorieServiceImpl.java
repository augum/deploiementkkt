package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.CategorieRequestDto;
import bdom.kikwit.Dto.CategorieResponseDto;
import bdom.kikwit.Entities.Categorie;
import bdom.kikwit.Mappers.CategorieMapper;
import bdom.kikwit.Repositories.CategorieRepository;
import bdom.kikwit.Services.CategorieService;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/*
* Gère les opération metiers sur l'entité catégorie
* */
@Service @AllArgsConstructor @Transactional
public class CategorieServiceImpl implements CategorieService {
    private CategorieRepository repository;
    private CategorieMapper mapper;

    // insertion d'une nouvelle catégorie
    @Override
    public CategorieResponseDto save(CategorieRequestDto requestDto) {
        Categorie categorie = mapper.fromCategorieRequestDto(requestDto);
        Categorie save = repository.save(categorie);
        return mapper.toCategorieResponseDto(save);
    }
 // Modification d'une catégrie
    @Override
    public CategorieResponseDto update(Long id, CategorieRequestDto requestDto) {
        Categorie categorie = mapper.fromCategorieRequestDto(requestDto);
        Categorie getCategorie = repository.findById(id).get();
        getCategorie.setLibelle(categorie.getLibelle());
        Categorie save = repository.save(getCategorie);
        return mapper.toCategorieResponseDto(save);
    }
// retourne une seule catégorie
    @Override
    public CategorieResponseDto getOne(Long id) {
        Categorie categorie = repository.findById(id).get();
        return mapper.toCategorieResponseDto(categorie);
    }

    @Override
    public String delete(Long id) {
        Optional<Categorie> categorie = repository.findById(id);
        if(categorie.isPresent()){
            repository.deleteById(id);
            return "Categorie supprimée avec succès";
        }
        return "Aucune categorie trouvée";
    }

    // retourne toutes les catégorie
    @Override
    public List<CategorieResponseDto> getAll() {
        List<Categorie> categorieList = repository.findAll();
        return categorieList.stream()
                .map(categorie -> mapper.toCategorieResponseDto(categorie))
                .collect(Collectors.toList());

    }
}
