package bdom.kikwit.ServiceImplementation;

import bdom.kikwit.Dto.RoleRequestDto;
import bdom.kikwit.Dto.RoleResponseDto;
import bdom.kikwit.Entities.Categorie;
import bdom.kikwit.Entities.Role;
import bdom.kikwit.Entities.SourceEnergie;
import bdom.kikwit.Mappers.RoleMapper;
import bdom.kikwit.Repositories.Rolerepository;
import bdom.kikwit.Services.RoleService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
@AllArgsConstructor
@Transactional
public class RoleServiceImpl implements RoleService {
    private Rolerepository rolerepository;
    private RoleMapper mapper;
    /**
     * @param requestDto
     * @return
     */
    @Override
    public RoleResponseDto save(RoleRequestDto requestDto) {
        Role role = mapper.fromRoleRequestDto(requestDto);
        Role roleSave = rolerepository.save(role);
        return mapper.toRoleResponseDto(roleSave);
    }

    /**
     * @param id
     * @param requestDto
     * @return
     */
    @Override
    public RoleResponseDto update(Long id, RoleRequestDto requestDto) {

        Role role = mapper.fromRoleRequestDto(requestDto);
        Role getRole = rolerepository.findById(id).get();
        getRole.setLibelle(role.getLibelle());
        Role save = rolerepository.save(getRole);
        return mapper.toRoleResponseDto(save);
    }

    /**
     * @param id
     */
    @Override
    public String delete(Long id) {
        Optional<Role> role = rolerepository.findById(id);
        if (role.isPresent()){
            rolerepository.deleteById(id);
            return " Role supprimé avec succes";
        }
        return "Aucune role trouvée";

    }

    /**
     * @return
     */
    @Override
    public List<RoleResponseDto> list() {
        List<Role> roleList = rolerepository.findAll();
        return roleList.stream()
                .map(role -> mapper.toRoleResponseDto(role))
                .collect(Collectors.toList());
    }

    /**
     * @param id
     * @return
     */
    @Override
    public RoleResponseDto getOne(Long id) {
        Role role = rolerepository.findById(id).get();
        return mapper.toRoleResponseDto(role);
    }
}
